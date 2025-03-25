import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Porkchop - Your Cooking Companion</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Discover recipes and cooking tips with Porkchop, your ultimate cooking companion!" />
        <link rel="icon" type="image/svg+xml" href="/assets/logo.svg" />
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center">Welcome to Porkchop - Your Cooking Companion</h1>
        <p className="text-lg text-center mt-4">Start exploring recipes and cooking tips!</p>
      </main>
    </>
  );
}