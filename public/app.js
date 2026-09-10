const dialog = document.querySelector("#delete-dialog");
document.querySelector("[data-delete-open]")?.addEventListener("click", () => dialog?.showModal());
document.querySelector("[data-delete-close]")?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
});
