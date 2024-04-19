import { Loader } from 'lucide-react';

export default function LoadingComponent() {
    return (
        <div className="flex justify-center">
            <Loader className="size-24 animate-spin my-12" />
        </div>
    );
}
