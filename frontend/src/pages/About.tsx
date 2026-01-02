export default function About() {
  return (
    <section className="py-10 animate-in fade-in slide-in-from-bottom-5">
      <h2 className="text-3xl font-bold mb-8 text-green-400">~/about_me.md</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4 text-gray-300">
          <p>
            I am a software engineer known as{" "}
            <span className="text-white font-bold">Pati</span>. I specialize in
            building full-stack applications using the MERN stack.
          </p>
          <p>
            Currently, I am deep-diving into{" "}
            <span className="text-green-500">DevOps</span>, learning how to
            scale applications using AWS, Docker, and CI/CD pipelines.
          </p>
        </div>
        <div className="border border-gray-800 p-6 bg-[#0a0a0a]">
          <h3 className="text-white mb-4 font-mono underline">
            Primary_Skills:
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-sm font-mono text-gray-500">
            <li>▹ React / Next.js</li>
            <li>▹ Node / Express</li>
            <li>▹ TypeScript</li>
            <li>▹ MongoDB</li>
            <li>▹ AWS / Docker</li>
            <li>▹ Linux / Bash</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
