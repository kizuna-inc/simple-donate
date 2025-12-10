import { Response } from "express";
import { jwtDecode } from "jwt-decode";

import { client } from "../db/client";
import { jwtInterface } from "../interface/auth/jwt";

export const jwtAuthFunc = async (token: string | undefined) => {
  if (token) {
    const decoded = jwtDecode(token) as jwtInterface;

    if (decoded !== undefined && decoded !== null) {
      const user = await client.user.findFirst({
        where: {
          username: decoded.sub,
        },
      });

      if (user !== undefined && user !== null) return true;
      else return false;
    }
  } else {
    return false;
  }
};
