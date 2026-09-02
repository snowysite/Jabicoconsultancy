/* =========================================================
   JABICO CONSULTANCY
   SHARED API CONFIGURATION

   This is the ONLY place the backend URL should be set.
   Every page that talks to the backend loads this file
   FIRST (before its own page script), then uses the
   API_BASE_URL constant defined here.

   ---------------------------------------------------------
   HOW TO POINT THIS AT YOUR DEPLOYED BACKEND
   ---------------------------------------------------------

   1. Deploy the /jabico-backend folder to a host that keeps
      Node.js running (Render, Railway, Fly.io, etc).
      GitHub Pages CANNOT run this - it only serves static
      files, so GitHub Pages alone will never reach a backend
      on its own.

   2. Copy the public URL that host gives you, e.g.
      https://jabico-backend.onrender.com

   3. Paste it below, replacing the value of API_BASE_URL.

   That's it - every page that includes this file will start
   using the new URL automatically, with nothing else to edit.
========================================================= */

const API_BASE_URL = "https://jabicoconsultancy-1.onrender.com";

/*
   ^ Change ONLY the line above when you deploy.
   Example once deployed:
   const API_BASE_URL = "https://jabico-backend.onrender.com";
*/
