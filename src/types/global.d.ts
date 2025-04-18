import mongooseClient from "mongoose";

declare global {
  var mongoose: {
    conn: typeof mongooseClient | null;
    promise: Promise<typeof mongooseClient> | null;
  };
}
