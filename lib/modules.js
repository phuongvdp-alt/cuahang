export const M = {
  'hang-hoa': { table: 'products', title: 'Hàng hóa', fields: [
    { k: 'code', l: 'Mã hàng' }, { k: 'name', l: 'Tên hàng' }, { k: 'category', l: 'Nhóm' },
    { k: 'cost', l: 'Giá vốn (bình quân)', t: 'number' }, { k: 'last_cost', l: 'Giá nhập gần nhất', t: 'number', ro: true }, { k: 'price', l: 'Giá bán', t: 'number' },
    { k: 'track_imei', l: 'Quản lý theo IMEI', t: 'checkbox' }, { k: 'warranty_months', l: 'Bảo hành (tháng)', t: 'number' },
    { k: 'stock', l: 'Tồn kho', t: 'number', ro: true }] },
  imei: { table: 'units', title: 'Máy theo IMEI', readonly: true, sel: '*, products(name)', fields: [
    { k: 'imei', l: 'IMEI' }, { k: 'products.name', l: 'Hàng' }, { k: 'status', l: 'Trạng thái', t: 'map', m: { in_stock: 'Trong kho', sold: 'Đã bán', repair: 'Đang sửa' } },
    { k: 'cost', l: 'Giá vốn', t: 'number' }, { k: 'sold_at', l: 'Ngày bán', t: 'dt' }] },
  'nha-cung-cap': { table: 'suppliers', title: 'Nhà cung cấp', fields: [
    { k: 'name', l: 'Tên' }, { k: 'phone', l: 'Điện thoại' }, { k: 'debt', l: 'Công nợ', t: 'number' }] },
  'khach-hang': { table: 'customers', title: 'Khách hàng', fields: [
    { k: 'name', l: 'Tên' }, { k: 'phone', l: 'Điện thoại' }, { k: 'note', l: 'Ghi chú' }] },
  'sua-chua': { table: 'repairs', title: 'Sửa chữa', fields: [
    { k: 'customer_name', l: 'Khách' }, { k: 'phone', l: 'Điện thoại' }, { k: 'device', l: 'Máy' }, { k: 'imei', l: 'IMEI' },
    { k: 'issue', l: 'Lỗi / tình trạng' },
    { k: 'status', l: 'Trạng thái', t: 'select', o: ['Đang kiểm tra', 'Chờ linh kiện', 'Đã xong', 'Đã trả'] },
    { k: 'parts_cost', l: 'Tiền linh kiện', t: 'number' }, { k: 'labor', l: 'Khách trả (tổng)', t: 'number' },
    { k: 'warranty_months', l: 'Bảo hành (tháng)', t: 'number' }, { k: 'created_at', l: 'Ngày nhận', t: 'dt', ro: true }] },
  'so-quy': { table: 'cashbook', title: 'Sổ quỹ', fields: [
    { k: 'type', l: 'Loại', t: 'select', o: ['thu', 'chi'] }, { k: 'amount', l: 'Số tiền', t: 'number' },
    { k: 'note', l: 'Nội dung' }, { k: 'created_at', l: 'Ngày', t: 'dt', ro: true }] },
  'hoa-don': { table: 'sales', title: 'Hóa đơn bán', readonly: true, fields: [
    { k: 'total', l: 'Tổng tiền', t: 'number' }, { k: 'created_at', l: 'Ngày', t: 'dt' }] },
}
