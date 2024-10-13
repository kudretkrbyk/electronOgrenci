import { Link } from "react-router-dom";
export default function HomeNavbar() {
  return (
    <div className="flex items-center justify-center gap-16 p-2 bg-gray-100">
      <div>
        <Link to="/Ogrenciler">
          {" "}
          <button className="bg-blue-300 p-2 px-4 rounded-xl focus:bg-blue-600">
            Öğrencileri Gör
          </button>
        </Link>
      </div>
      <div>
        <Link to="/Sinavlar">
          <button className="bg-blue-300 p-2 px-4 rounded-xl focus:bg-blue-600">
            {" "}
            Sınavları Gör
          </button>
        </Link>
      </div>
      <div>
        <Link to="/Sonuclar">
          {" "}
          <button className="bg-blue-300 p-2 px-4 rounded-xl focus:bg-blue-600">
            {" "}
            Sonuçları Gör
          </button>
        </Link>
      </div>
      <div>
        <Link to="/Rapor">
          {" "}
          <button className="bg-blue-300 p-2 px-4 rounded-xl focus:bg-blue-600">
            Rapor Al
          </button>
        </Link>
      </div>
      <div>
        <Link to="/Admin">
          {" "}
          <button className="bg-blue-300 p-2 px-4 rounded-xl focus:bg-blue-600 ">
            Veri Girişi
          </button>
        </Link>
      </div>
    </div>
  );
}
