import { defineConfig } from "orval";

export default defineConfig({
  myApi: {
    // آدرس فایل Swagger بک‌اند (می‌تواند URL یا مسیر فایل json/yaml لوکال باشد)
    input: "http://localhost:8001/swagger-json",
    output: {
      mode: "tags-split", // کدهای هر بخش (مثل User, Product) را در فایل‌های جداگانه می‌ریزد
      target: "src/api/generated/endpoints", // مسیر ذخیره سرویس‌ها
      schemas: "src/api/generated/models", // مسیر ذخیره تایپ‌ها و اینترفیس‌ها
      client: "axios",
      override: {
        mutator: {
          path: "src/api/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});
