import "../../css/Menu.css"

export default function MenuItem({item, onClose}: any) {
    return (
        <div className="menu_item_main">
            <div className="menu_item_main_backdrop">

            </div>
            <div className="menu_item_main_content">
                <button className="menu_item_main_close" onClick={onClose}>x</button>
                <p>This is the menu</p>
                <p>{item.name}</p>
            </div>
            
        </div>
    )
}