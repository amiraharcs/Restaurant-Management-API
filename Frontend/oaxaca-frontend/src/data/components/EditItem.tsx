export default function EditItem({item, onClose} : any ) {
    return (
        <div className="menu_item_main" onClick={onClose}>
            <div className="menu_item_main_backdrop">

            </div>
            <div className="edit_item_content">
                <button className="menu_item_main_close" onClick={onClose}>x</button>
                <p>Edit Product</p>
                <form action="" className="order_form">
                    <input type="text" />
                    <input type="text" />
                </form>
            </div>
        </div>
    )
}