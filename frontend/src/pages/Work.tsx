// import { useEffect, useState } from "react";

export default function Work() {
//   const [projects, setProjects] = useState<Project[]>([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/projects")
//       .then((res) => res.json())
//       .then((data) => setProjects(data));
//   }, []);

  return (
    <section className="py-10 animate-in fade-in">
      <h2 className="text-3xl font-bold mb-8">./projects/view_all</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* {projects.map((project) => (
        //   <ProjectCard key={project.id} project={project} />
        ))} */}
      </div>
    </section>
  );
}
