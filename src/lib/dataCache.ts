type DATA_CACHE_TAG = "USERS" | "CATEGORIES" | "PRODUCTS" | "ORDERS";

export function getGlobalTag(tag: DATA_CACHE_TAG) {
  return `global:${tag}`;
}

export function getIdTag(id: string, tag: DATA_CACHE_TAG) {
  return `tag:${tag}-id:${id}`;
}

export function getUserTag(userId: string, tag: DATA_CACHE_TAG) {
  return `tag:${tag}-userId:${userId}`;
}

export function getBookTag(bookId: string, tag: DATA_CACHE_TAG) {
  return `tag:${tag}-bookId:${bookId}`;
}
