// ES Modules syntax
import Unsplash, { toJson } from "unsplash-js";


const unsplash = new Unsplash({
  applicationId: "8a02e170154e1afdc903694260f8bef64f15ede2cbe4b3458182d0f549e1e472",
  secret: "dad76f8aadab37aa218c6137ce307fcf957c5b040d335c20f03934b3f692a573"
});

export {unsplash,toJson}