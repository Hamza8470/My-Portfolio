(function () {
  var canvasHost = document.querySelector("#wrapper-canvas");
  var mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var scene = null;

  function shouldAnimate() {
    return (
      canvasHost &&
      window.innerWidth >= 768 &&
      !mediaQuery.matches &&
      typeof window.Matter !== "undefined"
    );
  }

  function stopScene() {
    if (!scene) {
      return;
    }

    window.Matter.Render.stop(scene.render);
    window.Matter.Runner.stop(scene.runner);
    if (scene.render.canvas) {
      scene.render.canvas.remove();
    }
    scene = null;
  }

  function createScene() {
    var Matter = window.Matter;
    var Engine = Matter.Engine;
    var Runner = Matter.Runner;
    var Render = Matter.Render;
    var World = Matter.World;
    var Bodies = Matter.Bodies;
    var Body = Matter.Body;
    var Common = Matter.Common;

    if (typeof Matter.use === "function") {
      if (window.MatterAttractors) {
        Matter.use("matter-attractors");
      }
      if (window.MatterWrap) {
        Matter.use("matter-wrap");
      }
    }

    var width = window.innerWidth;
    var height = window.innerHeight;
    var engine = Engine.create();
    var render = Render.create({
      element: canvasHost,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "transparent",
      },
    });
    var runner = Runner.create();
    var world = engine.world;

    world.gravity.x = 0;
    world.gravity.y = 0;
    world.gravity.scale = 0;

    var anchor = Bodies.circle(width / 2, height / 2, Math.max(width, height) / 28, {
      isStatic: true,
      render: {
        fillStyle: "#0f172a",
        strokeStyle: "#0f172a",
        lineWidth: 0,
      },
      plugin: {
        attractors: window.MatterAttractors
          ? [
              function (bodyA, bodyB) {
                return {
                  x: (bodyA.position.x - bodyB.position.x) * 0.0000012,
                  y: (bodyA.position.y - bodyB.position.y) * 0.0000012,
                };
              },
            ]
          : [],
      },
    });

    World.add(world, anchor);

    for (var i = 0; i < 52; i += 1) {
      var x = Common.random(0, width);
      var y = Common.random(0, height);
      var radius = Common.random(8, 46);
      var sides = Math.round(Common.random(3, 6));
      var tone = Common.random(0, 1);

      World.add(
        world,
        Bodies.polygon(x, y, sides, radius, {
          mass: radius / 20,
          friction: 0,
          frictionAir: 0.018,
          render: {
            fillStyle: tone > 0.5 ? "#15334d" : "#132033",
            strokeStyle: "#1595b6",
            lineWidth: 1,
            opacity: 0.6,
          },
        })
      );

      World.add(
        world,
        Bodies.circle(x, y, Common.random(2, 10), {
          mass: 0.2,
          friction: 0,
          frictionAir: 0.02,
          render: {
            fillStyle: tone > 0.5 ? "#38bdf8" : "#8b5cf6",
            strokeStyle: "#111827",
            lineWidth: 1,
            opacity: 0.5,
          },
        })
      );
    }

    Matter.Events.on(engine, "beforeUpdate", function () {
      Body.setPosition(anchor, {
        x: width / 2 + Math.sin(Date.now() * 0.001) * 40,
        y: height / 2 + Math.cos(Date.now() * 0.0013) * 28,
      });
    });

    Runner.run(runner, engine);
    Render.run(render);

    scene = {
      engine: engine,
      render: render,
      runner: runner,
    };
  }

  function refreshScene() {
    stopScene();

    if (!shouldAnimate()) {
      return;
    }

    createScene();
  }

  window.addEventListener("load", refreshScene);
  window.addEventListener("resize", function () {
    clearTimeout(window.__portfolioMatterResize__);
    window.__portfolioMatterResize__ = setTimeout(refreshScene, 180);
  });

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", refreshScene);
  }
})();
