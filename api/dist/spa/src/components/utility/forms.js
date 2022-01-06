const formData = event => {
  return Object.fromEntries(new FormData(event.target).entries())
}

export { formData }
