export interface IRequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE",
    mode?: "cors" | "no-cors" | "*cors" | "same-origin",
    cache: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached",
    credentials: "omit" | "same-origin" | "include",
    headers: Map<string, string>,
    redirect: 'follow' | "manual" | "*follow" | "error",
    referrerPolicy: 'no-referrer' | "*no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url",
    body: any
  }