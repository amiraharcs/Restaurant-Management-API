import '../../css/Waiter.css';

export default function AlertDetails({ alert, onClose, onMarkHandled, isOrderReady }: any) {
  function timeAgo(iso: string) {
    const now = new Date();
    const created = new Date(iso);
    const mins = Math.floor((now.getTime() - created.getTime()) / 60000);
    return mins <= 0 ? "Just now" : `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }

  return (
    <main className="orderDetailsMain">
      <div className="orderDetailsBackdrop" onClick={onClose} />
      <div className="orderDetailsContent">
        <div className='orderDetailsHeader'>
          <div className='orderDetailsTitle'>{isOrderReady ? `Order #${alert.id}` : `Table ${alert.tableNumber}`}</div>
          <button className="orderDetailsClose" onClick={onClose}>×</button>
        </div>
        <div className='orderDetailsMainBody'>
          {isOrderReady ? (
            <>
              <div className='orderDetailsInfo'>
                <div className='infoRow'><p className='infoKey'>Customer :</p><p className='infoValue'>{alert.customerName}</p></div>
                <div className='infoRow'><p className='infoKey'>Table :</p><p className='infoValue'>{alert.tableNumber}</p></div>
                <div className='infoRow'><p className='infoKey'>Placed :</p><p className='infoValue'>{timeAgo(alert.createdAt)}</p></div>
                <div className='infoRow'><p className='infoKey'>Status :</p><p className='infoValue'>{alert.status}</p></div>
              </div>
              <div className='orderDetailsItems'>
                <p className='itemsTitle'>Order Items</p>
                <div className='itemsList'>
                  {alert.items.map((item: any, index: number) => (
                    <div key={`${item.name}${index}`} className='itemsRow'>
                      <p className='itemQuantity'>{item.quantity}x</p>
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className='orderDetailsButtons'>
                <button className='popupBtn confirmBtn' onClick={() => onMarkHandled(alert.id)}>Delivered</button>
                <button className='popupBtn cancelBtn' onClick={onClose}>CANCEL</button>
              </div>
            </>
          ) : (
            <>
              <div className='orderDetailsInfo'>
                <div className='infoRow'><p className='infoKey'>Table :</p><p className='infoValue'>{alert.tableNumber}</p></div>
                <div className='infoRow'><p className='infoKey'>Customer :</p><p className='infoValue'>{alert.customerName}</p></div>
                <div className='infoRow'><p className='infoKey'>Message :</p><p className='infoValue'>{alert.message}</p></div>
                <div className='infoRow'><p className='infoKey'>Created :</p><p className='infoValue'>{timeAgo(alert.createdAt)}</p></div>
              </div>
              <div className='orderDetailsButtons'>
                <button className='popupBtn confirmBtn' onClick={() => onMarkHandled(alert.id)}>Mark Handled</button>
                <button className='popupBtn cancelBtn' onClick={onClose}>Close</button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
