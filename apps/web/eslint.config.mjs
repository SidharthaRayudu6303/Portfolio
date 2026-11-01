import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "dist/**"],
  },
];

export default eslintConfig;
