import { toast } from 'react-toastify';

export type ToastOptions = {
    text: string;
    duration?: number;
};

export class ToastService {
    private static readonly DEFAULT_DURATION = 3000;
    private static readonly DEFAULT_POSITION = 'bottom-center';

    public static success(options: ToastOptions) {
        toast.success(options.text, {
            autoClose: options.duration || this.DEFAULT_DURATION,
            position: this.DEFAULT_POSITION,
            bodyClassName: 'toastWrapper toastSuccess',
        });
    }

    public static error(options: ToastOptions) {
        console.log(options)
        toast.error(options.text, {
            autoClose: options.duration || this.DEFAULT_DURATION,
            position: this.DEFAULT_POSITION,
            className: 'toastWrapper toastError',
        });
    }
}
