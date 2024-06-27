// import { getPlatform } from "../engine/src/util/bootstrapLocal";

const platform = "mobile"; //getPlatform(is);
import(`./app.${platform}.ts`).then(() => {
  slotapp.config = {
    // web: {
    //   name: "web",
    //   js: "web",
    //   layout: "web",
    // },
    mobile: {
      name: "mobile",
      js: "mobile",
      layout: "mobile"
    }
    // mini: {
    //   name: "mini",
    //   js: "mini",
    //   layout: "mini",
    // },
    // desktop: {
    //   name: "desktop",
    //   js: "web",
    //   layout: "web",
    // },
  }[platform];
  slotapp.bootstrap();
});
