import { get } from "https";

get(
  "https://raw.githubusercontent.com/13y32r/Html5_3D/main/threeSrc/libs/P_AnimationSystem/P_AnimationSystem_GUI/p_AnimationSystem_GUI_TimeLine.js",
  (resp) => {
    let data = "";

    // A chunk of data has been received.
    resp.on("data", (chunk) => {
      //   data += chunk;
      console.log(chunk.toString());
      console.log("-------------------------");
    });

    // The whole response has been received. Print out the result.
    resp.on("end", () => {
      //   console.log(data);
      //   console.log(JSON.parse(data));
    });
  }
).on("error", (err) => {
  console.log("Error: " + err.message);
});