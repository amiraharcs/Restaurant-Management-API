import '../../css/Waiter.css';

export default function AlertDetails({ alert, onClose, onMarkHandled, isOrderReady }: any) {
  // calculates the timer
  function timeAgo(iso: string) {
    const now = Date.now();
    const createdMs = new Date(iso).getTime();
    const mins = Math.max(0, Math.floor((now - createdMs) / 60000));

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) {
      const remainingMins = mins % 60;
      return remainingMins === 0
        ? `${hours} hour${hours > 1 ? "s" : ""} ago`
        : `${hours}h ${remainingMins}m ago`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours === 0
      ? `${days} day${days > 1 ? "s" : ""} ago`
      : `${days}d ${remainingHours}h ago`;
  }

  return (
    <main className="orderDetailsMain">
      {/* Alert popup */}
      <div className="orderDetailsBackdrop" onClick={onClose} />
      <div className="orderDetailsContent">
        <div className='orderDetailsHeader'>
          <div className='orderDetailsTitle'>{isOrderReady ? `Order #${alert.id}` : `Table ${alert.tableNumber}`}</div>
          <button className="orderDetailsClose" onClick={onClose}>×</button>
        </div>
        <div className='orderDetailsMainBody'>
          {/* Depending on order status, the popup details will change */}
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
