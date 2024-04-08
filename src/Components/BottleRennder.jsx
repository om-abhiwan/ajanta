// import * as BABYLON from "@babylonjs/core";
// import {useEffect, useRef, useState } from "react";
// import "@babylonjs/loaders/glTF";

// const BottleRennder = () => {
//   const canvasRef = useRef(null);
//   const engineRef = useRef(null);

//   const [mesh2Visible, setMesh2Visible] = useState(1);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const engine = new BABYLON.Engine(canvas, true);
//     engineRef.current = engine;

//     const createScene = () => {
//       const scene = new BABYLON.Scene(engine);

//       const camera = new BABYLON.ArcRotateCamera(
//         "camera",
//         Math.PI / 4,
//         Math.PI / 4,
//         0, //radius
//         new BABYLON.Vector3(0, 0, 0),
//         scene
//       );
//       camera.attachControl(canvas, true);
//       camera.setPosition(new BABYLON.Vector3(0, 0, 5));

//       camera.lowerRadiusLimit = 3;
//       camera.upperRadiusLimit = 6;

//       const light = new BABYLON.HemisphericLight(
//         "light",
//         new BABYLON.Vector3(0, 0, 0),
//         scene
//       );
//       light.intensity = 3;

//       if(mesh2Visible===1){
//           BABYLON.SceneLoader.ImportMesh("", "/models/", "bttale_01.glb", scene,function(meshes){
//             const mesh = meshes[0];
//             mesh.scaling.setAll(20);

//             const rotationQuaternion = BABYLON.Quaternion.RotationAxis(
//             new BABYLON.Vector3(1, 0, 0),
//             Math.PI / 2
//             );
//             mesh.rotationQuaternion = rotationQuaternion;
//             mesh.position.y = -.8;
//           });
//       }else{
//           BABYLON.SceneLoader.ImportMesh("", "/models/", "bttale_02.glb", scene,function(meshes){
//             const mesh = meshes[0];
//             mesh.scaling.setAll(6);

//             const rotationQuaternion = BABYLON.Quaternion.RotationAxis(
//             new BABYLON.Vector3(1, 0, 0),
//             Math.PI / 2
//             );
//             mesh.rotationQuaternion = rotationQuaternion;

//             mesh.position.y = -1;
//           });
//       }
//       return scene;
//     };

//     const scene = createScene();
//     engine.runRenderLoop(() => {
//       scene.render();
//     });

//     window.addEventListener("resize", () => {
//       engine.resize();
//     });

//     return () => {
//       scene.dispose();
//       engine.dispose();
//     };
//   }, [mesh2Visible]);

//   const handleToggleMesh = () =>{
//     if(mesh2Visible===1){
//         setMesh2Visible(2)
//     }else if(mesh2Visible===2){
//         setMesh2Visible(1)
//     }
//   }

//   return (
//     <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
//         <canvas
//         ref={canvasRef}
//         style={{ width: "100%", height: "100%", outline: "none" }}
//         />
//         <button
//         onClick={handleToggleMesh}
//         style={{
//             position: "absolute",
//             top: "10px",
//             left: "10px",
//             zIndex: 1,
//             padding: "10px",
//             backgroundColor: "rgba(255, 255, 255, 0.5)",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             fontSize:"80%"
//         }}
//         >
//         Change The Bottle
//         </button>
//   </div>
//   );
// };

// export default BottleRennder;

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
      camera.attachControl(canvas, true);
      camera.lowerRadiusLimit = 4.4;
      camera.upperRadiusLimit = 6;

      // for upper and lower movement of mesh
      camera.upperBetaLimit = Math.PI / 4;
      camera.lowerBetaLimit = 1;
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
          bottom: "15%",
          left: 0,
          width: "100%",
          padding: "10px",
          color: "#fff",
        }}
      >
        <h2 className="descrption">Description</h2>

        {/* <div className="infoContainer"> */}
        {mesh2Visible === 1 ? (
          <ul className="uList">
            <li>
              {" "}
              <div className="infoList">
                {" "}
                <span>Capacity</span>{" "}
                <span>4291+/-29.5ml</span>
              </div>
            </li>
            <li>
              {" "}
              <div className="infoList">
                {" "}
                <span >Height</span>{" "}
                <span >340.52+/-2mm</span>
              </div>
            </li>
            <li>
              {" "}
              <div className="infoList">
                {" "}
                <span >Width</span>{" "}
                <span >158.9+/-2.38mm</span>
              </div>
            </li>
            <li>
              {" "}
              <div className="infoList">
                {" "}
                <span >Weight</span>{" "}
                <span >1450+/-50gm</span>
              </div>
            </li>
            <li>
              {" "}
              <div className="infoList">
                {" "}
                <span >Glass bottle Color</span>{" "}
                <span >Amber</span>
              </div>
            </li>
            <li>
              {" "}
              <div className="infoList">
                {" "}
                <span >Shape</span>{" "}
                <span >Round</span>
              </div>
            </li>
            <li>
              {" "}
              <div className="infoList">
                {" "}
                <span >Neck Type</span>{" "}
                <span >Other</span>
              </div>
            </li>
          </ul>
        ) : (
          <ul className="uList">
            <li>Capacity : 110+/-5ml</li>
            <li>Height : 92.3+/-1mm</li>
            <li>Width : 67+/-1.2mm</li>
            <li>Weight : 230 gms approx</li>
            <li>Glass bottle Color : Flint</li>
            <li>Shape : Square</li>
            <li>Neck Size : Other</li>
            <li>Neck Type : Other</li>
          </ul>
        )}
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
