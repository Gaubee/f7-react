import f7c from "f7r/plugin/postcss";
import tailwindcss from "@tailwindcss/postcss";
export default {
  plugins: [tailwindcss(), f7c()],
};
