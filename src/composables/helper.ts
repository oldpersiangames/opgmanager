import { useSnackbarQueueStore } from "@/stores/snackbarQueue";

export function useHelper() {

    const snackbarQueue = useSnackbarQueueStore()

    function notify(data: any) {
        snackbarQueue.$patch((state) => {
            state.queue.push(data)
        })
    }

    function imageFileToBase64(file: File, maximum_size = 1280) {
        return new Promise((resolve) => {

            const reader = new FileReader();

            reader.onload = (ev) => {
                if (!ev.target) return
                const image = new Image();

                image.src = ev.target.result as string;

                image.addEventListener('load', function () {
                    const c = document.createElement('canvas');
                    const ctx = c.getContext('2d');
                    if (!ctx) return;
                    if (this.naturalWidth > maximum_size || this.naturalHeight > maximum_size) {
                        if (this.naturalWidth > this.naturalHeight) {
                            c.width = maximum_size;
                            c.height = (maximum_size * this.naturalHeight) / this.naturalWidth;
                        } else {
                            c.height = maximum_size;
                            c.width = (maximum_size * this.naturalWidth) / this.naturalHeight;
                        }
                    } else {
                        c.width = this.naturalWidth;
                        c.height = this.naturalHeight;
                    }
                    ctx.drawImage(this, 0, 0, c.width, c.height);

                    resolve(c.toDataURL('image/jpeg', 0.8));
                });
            };


            reader.readAsDataURL(file);

        });
    }

    const imageFileInputToBase64 = (maximum_size = 1280) => {
        return new Promise((resolve) => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';

            fileInput.addEventListener('change', async () => {
                if (fileInput.files && fileInput.files.length == 1) {
                    const photo = fileInput.files[0];
                    fileInput.remove();
                    resolve(await imageFileToBase64(photo, maximum_size))
                }
            });

            fileInput.click();
        });
    };


    return { notify, imageFileInputToBase64 };
};