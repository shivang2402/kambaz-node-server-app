const module = {
    id: 1, 
    name: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    course: "2021-10-10",
  };
  export default function Mod(app) {
    app.get("/lab5/module", (req, res) => {
      res.json(module);
    });
  
    app.get("/lab5/module/name", (req, res) => {
      res.send(module.name);
    });
  };