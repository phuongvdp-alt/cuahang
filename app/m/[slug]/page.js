import Crud from '../../../components/Crud'
import { M } from '../../../lib/modules'
export default function P({ params }) { const m = M[params.slug]; return m ? <Crud key={params.slug} {...m} /> : <p>Không tìm thấy mục này.</p> }
