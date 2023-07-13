process.on("unhandledRejection", (reason: unknown) => {
  // eslint-disable-next-line no-console
  console.error("UNHANDLED PROMISE", reason);
});
