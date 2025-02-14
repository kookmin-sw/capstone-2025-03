import { lazy } from "react";

const pages = import.meta.glob("./pages/**/[A-Z]*.tsx");

const routes = Object.keys(pages).map((path) => {
  // 파일 경로에서 라우트 경로 추출
  const routePath = path
    .replace("./pages", "")
    .replace(/\/[A-Z][^/]+\.tsx$/, "") // 파일명 제거
    .toLowerCase()
    .replace(/\[(.*?)\]/g, ":$1"); // 동적 라우팅 처리

  return {
    path: routePath === "/home" ? "/" : routePath, // /main은 루트(/)로 설정
    Component: lazy(pages[path] as any), // Lazy loading 적용
  };
});

export default routes;