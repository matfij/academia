import PageHeaderComponent from '../../_components/page-header';
import ProductFormComponent from '../../_components/product-form';

export default function AdminProductsNewPage() {
    return (
        <>
            <PageHeaderComponent>Create New Product</PageHeaderComponent>
            <ProductFormComponent />
        </>
    );
}
