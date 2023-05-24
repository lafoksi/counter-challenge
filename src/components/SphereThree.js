import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as THREE from 'three';

const SphereViewer = () => {
  const canvasRef = useRef(null);
  const [radius, setRadius] = useState(1);

  useEffect(() => {
    let scene, camera, renderer, sphere;

    const setupScene = () => {
      // Create the scene
      scene = new THREE.Scene();

      // Create the camera
      camera = new THREE.PerspectiveCamera(75, 500 / 300, 0.1, 500);
      camera.position.z = 5;

      // Create the renderer
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
      renderer.setSize(500, 300);
      renderer.setClearColor(0x000000, 0);
    };

    const createSphere = () => {
      // Create the sphere geometry and material
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
      sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(0, 0, -5);

      // Add the sphere to the scene
      scene.add(sphere);
    };

    const renderScene = () => {
      requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
    };

    setupScene();
    createSphere();
    renderScene();

    return () => {
      scene.remove(sphere);
      renderer.dispose();
    };
  }, [radius]);

  useEffect(() => {
    // Example JSON-RPC API call to get the radius
    const get_radius = () => {
      const currentRadius = radius; // Replace with your actual JSON-RPC API call to get the current radius
      console.log('Current radius:', currentRadius);
    };
    get_radius();
  }, [radius]);

  const handleRadiusChange = async (event) => {
    
      try {
        const response = await axios.post('http://localhost:3300/radius', {
          jsonrpc: '2.0',
          method: 'set_radius',
          params: event.target.value,
          id: 1,
        });
        console.log(response.data.result);
        if (response.data && response.data.result && response.data.result > 0) {
          const newRadius = parseFloat(response.data.result);
          
          setRadius(newRadius);
        }
          
     
      } catch (error) {
        console.error('Error:', error);
      }
    };
    


  return (
   
      

<>

<div className='text-yellow-500 text-xl cursor-pointer'>
          <input className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="number" value={radius} onChange={handleRadiusChange} />
      </div>
      <canvas ref={canvasRef} width={500} height={300} />

      </>
  );
};

export default SphereViewer;
