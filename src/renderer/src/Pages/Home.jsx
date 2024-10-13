import logo from "../assets/yarimca.png";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <img className="bg-center bg-cover w-full h-[500px]" src={logo}></img>
      <div className="text-xl font-bold">
        Yarımca Ortaokulu Öğrenci Takip Sistemi
      </div>
    </div>
  );
}
