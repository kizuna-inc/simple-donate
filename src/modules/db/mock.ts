// export const streamTemplate = {
//   image: "static/upload/cdn/alert.gif",
//   sound: "static/upload/cdn/alert.mp3",
//   text: ["thank you", "for"],
// };

import { client } from "./client";

export const streamTemplate = async () => {
  if ((await client.streamAlert.count()) < 1) {
    await client.streamAlert.create({
      data: {
        image: "static/upload/cdn/alert.gif",
        sound: "static/upload/cdn/alert.mp3",
        text: "thank you --user-- for --amount-- THB",
      },
    });
  }

  const template = await client.streamAlert.findFirst();

  return template;
};
