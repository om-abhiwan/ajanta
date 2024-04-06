import * as BABYLON from "@babylonjs/core";
import {useEffect, useRef, useState } from "react";
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
        0, //radius
        new BABYLON.Vector3(0, 0, 0),
        scene
      );
      camera.attachControl(canvas, true);
      camera.setPosition(new BABYLON.Vector3(0, 0, 5));

      camera.lowerRadiusLimit = 3;
      camera.upperRadiusLimit = 6;

      const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 0, 0),
        scene
      );
      light.intensity = 3;


      if(mesh2Visible===1){
          BABYLON.SceneLoader.ImportMesh("", "/models/", "bttale_01.glb", scene,function(meshes){
            const mesh = meshes[0];
            mesh.scaling.setAll(20);
    
            const rotationQuaternion = BABYLON.Quaternion.RotationAxis(
            new BABYLON.Vector3(1, 0, 0),
            Math.PI / 2 
            );
            mesh.rotationQuaternion = rotationQuaternion;
    
            mesh.position.y = -.8;
          });
      }else{
          BABYLON.SceneLoader.ImportMesh("", "/models/", "bttale_02.glb", scene,function(meshes){
            const mesh = meshes[0];
            mesh.scaling.setAll(6);
    
            const rotationQuaternion = BABYLON.Quaternion.RotationAxis(
            new BABYLON.Vector3(1, 0, 0),
            Math.PI / 2 
            );
            mesh.rotationQuaternion = rotationQuaternion;
    
            mesh.position.y = -1;
          });
      }






      return scene;
    };

    const scene = createScene();
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


  const handleToggleMesh = () =>{
    if(mesh2Visible===1){
        setMesh2Visible(2)
    }else if(mesh2Visible===2){
        setMesh2Visible(1)
    }
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", outline: "none" }}
        />
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
            fontSize:"80%"
        }}
        >
        Change The Bottle
        </button>
  </div>
  );
};

export default BottleRennder;
