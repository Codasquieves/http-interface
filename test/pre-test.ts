process.on("unhandledRejection", (reason: unknown | null | undefined) => {
  // eslint-disable-next-line no-console
  console.error("UNHANDLED PROMISE", reason);
});
