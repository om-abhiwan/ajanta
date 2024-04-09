import * as BABYLON from "@babylonjs/core";
import { useEffect, useRef, useState } from "react";
import "@babylonjs/loaders/glTF";

const BottleRennder = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [mesh2Visible, setMesh2Visible] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    engineRef.current = engine;

    const createScene = () => {
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 4,
        Math.PI / 4,
        5, // distance
        new BABYLON.Vector3(0, 0, 0),
        scene
      );
      // to set the orbit
      // to follow the mesh
      camera.attachControl(canvas, true);
      // camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      camera.lowerRadiusLimit = 4.4;
      camera.upperRadiusLimit = 6;

      // for upper and lower movement of mesh
      // camera.lowerBetaLimit = 2;
      // camera.upperBetaLimit = Math.PI / 2;
      camera.lowerBetaLimit = Math.PI / 5; //niche aane k liye
      camera.upperBetaLimit = (2 * Math.PI) / 4.5;//upper jane k lye
      // camera.beta = (camera.lowerBetaLimit + camera.upperBetaLimit) / 2 - 0.1;
      camera.wheelPrecision = 50;

      const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
      );
      light.intensity = 0.7;

      const outlineRenderer = new BABYLON.DefaultRenderingPipeline(
        "outlineRenderer",
        true,
        scene,
        [camera]
      );
      outlineRenderer.samples = 4; // Increase for smoother outlines
      outlineRenderer.fxaaEnabled = true; // Enable anti-aliasing for outlines
      outlineRenderer.imageProcessingEnabled = false; // Disable image processing for outlines
      outlineRenderer.enablePixelPerfectMode = true; // Ensure pixel-perfect outlines

      return scene;
    };

    const scene = createScene();

    const loadMesh = (filename, scaling, positionY) => {
      BABYLON.SceneLoader.ImportMesh(
        "",
        "/models/",
        filename,
        scene,
        (meshes) => {
          const mesh = meshes[0];
          mesh.scaling.setAll(scaling);

          const rotationQuaternion = BABYLON.Quaternion.RotationAxis(
            new BABYLON.Vector3(1, 0, 0),
            Math.PI / 2
          );
          mesh.rotationQuaternion = rotationQuaternion;
          mesh.position.y = positionY;

          // Enable outline effect on the mesh
          scene.getMeshByName(mesh.name).outlineWidth = 0.1;
          scene.getMeshByName(mesh.name).outlineColor = BABYLON.Color3.Black();
        }
      );
    };

    // Load initial mesh based on state
    if (mesh2Visible === 1) {
      loadMesh("bttale_01.glb", 16, 0.3);
    } else if (mesh2Visible === 2) {
      loadMesh("bttale_02.glb", 4.5, 0.3);
    }

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, [mesh2Visible]);

  const handleToggleMesh = () => {
    setMesh2Visible(mesh2Visible === 1 ? 2 : 1);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", outline: "none" }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: 0,
          width: "100%",
          padding: "10px",
          color: "#fff",
        }}
      >
        <div className="mainContainer">
          <h2 className="descrption">Description</h2>

          {/* <div className="infoContainer"> */}
          {mesh2Visible === 1 ? (
            <div
              className="listContainer"
              style={{
                display: "flex",
                flexFlow: "row wrap",
                justifyContent: "space-around",
              }}
            >
              <div>
                <ul>
                  <li>Capacity</li>
                  <li>Height</li>
                  <li>Width</li>
                  <li>Weight</li>
                  <li>Glass bottle Color</li>
                  <li>Shape</li>
                  <li>Neck Type</li>
                </ul>
              </div>
              <div>
                <ul>
                  <li>4291+/-29.5ml</li>
                  <li>340.52+/-2mm</li>
                  <li>158.9+/-2.38mm</li>
                  <li>1450+/-50gm</li>
                  <li>Amber</li>
                  <li>Round</li>
                  <li>Other</li>
                </ul>
              </div>
            </div>
          ) : (
            <div
              className="listContainer"
              style={{
                display: "flex",
                flexFlow: "row wrap",
                justifyContent: "space-around",
              }}
            >
              <div>
                <ul>
                  <li>Capacity</li>
                  <li>Height</li>
                  <li>Width</li>
                  <li>Weight</li>
                  <li>Glass bottle Color</li>
                  <li>Shape</li>
                  <li>Neck Size</li>
                  <li>Neck Type</li>
                </ul>
              </div>
              <div>
                <ul>
                  <li>110+/-5ml</li>
                  <li>92.3+/-1mm</li>
                  <li>67+/-1.2mm</li>
                  <li>230 gms approx</li>
                  <li>Flint</li>
                  <li>Square</li>
                  <li>Other</li>
                  <li>Other</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        {/* </div> */}
      </div>

      <button
        onClick={handleToggleMesh}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "80%",
        }}
      >
        Change The Bottle
      </button>
    </div>
  );
};

export default BottleRennder;
