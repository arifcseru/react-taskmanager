import http from "./httpService";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/tasks";

function taskUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getAll() {
  return http.get(apiEndpoint);
}

export function get(taskId) {
  return http.get(taskUrl(taskId));
}

export function save(task) {
  if (task._id) {
    const body = { ...task };
    delete body._id;
    return http.put(taskUrl(task._id), body);
  }

  return http.post(apiEndpoint, task);
}

export function remove(taskId) {
  return http.delete(taskUrl(taskId));
}
