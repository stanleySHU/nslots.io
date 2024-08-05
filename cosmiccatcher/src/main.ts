const platform = "mobile"; //getPlatform(is);
import(`./app.${platform}.ts`).then(() => {
  slotapp.config = {
    mobile: {
      name: "mobile",
      js: "mobile",
      layout: "mobile"
    }
  }[platform];
  slotapp.bootstrap();
});
