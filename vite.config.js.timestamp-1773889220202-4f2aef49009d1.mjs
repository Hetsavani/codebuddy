// vite.config.js
import { defineConfig } from "file:///D:/Projects/codebuddy/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/codebuddy/node_modules/@vitejs/plugin-react/dist/index.js";
import { crx } from "file:///D:/Projects/codebuddy/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Codebuddy",
  version: "1.0",
  description: "A simple Chrome extension.",
  action: {
    default_popup: "index.html"
  },
  permissions: [
    "activeTab",
    "scripting",
    "storage"
  ],
  content_scripts: [
    {
      matches: ["https://leetcode.com/problems/*"],
      js: ["src/content.jsx"]
    }
  ]
};

// vite.config.js
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFByb2plY3RzXFxcXGNvZGVidWRkeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdHNcXFxcY29kZWJ1ZGR5XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9jb2RlYnVkZHkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuanNvbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGNyeCh7IG1hbmlmZXN0IH0pXSxcbn0pXG4iLCAie1xyXG4gIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxyXG4gIFwibmFtZVwiOiBcIkNvZGVidWRkeVwiLFxyXG4gIFwidmVyc2lvblwiOiBcIjEuMFwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJBIHNpbXBsZSBDaHJvbWUgZXh0ZW5zaW9uLlwiLFxyXG4gIFwiYWN0aW9uXCI6IHtcclxuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcImluZGV4Lmh0bWxcIlxyXG4gIH0sXHJcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXHJcbiAgICBcImFjdGl2ZVRhYlwiLFxyXG4gICAgXCJzY3JpcHRpbmdcIixcclxuICAgIFwic3RvcmFnZVwiXHJcbiAgXSxcclxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCJodHRwczovL2xlZXRjb2RlLmNvbS9wcm9ibGVtcy8qXCJdLFxyXG4gICAgICBcImpzXCI6IFtcInNyYy9jb250ZW50LmpzeFwiXVxyXG4gICAgfVxyXG4gIF1cclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVAsU0FBUyxvQkFBb0I7QUFDcFIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsV0FBVzs7O0FDRnBCO0FBQUEsRUFDRSxrQkFBb0I7QUFBQSxFQUNwQixNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsSUFDUixlQUFpQjtBQUFBLEVBQ25CO0FBQUEsRUFDQSxhQUFlO0FBQUEsSUFDYjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakI7QUFBQSxNQUNFLFNBQVcsQ0FBQyxpQ0FBaUM7QUFBQSxNQUM3QyxJQUFNLENBQUMsaUJBQWlCO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQ0Y7OztBRGRBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLDJCQUFTLENBQUMsQ0FBQztBQUN0QyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
