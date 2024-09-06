import SpotCard from "../SpotCard";
import './HomePage.css';

export const HomePage = () => {
  const testArray = []
  return(
    <main className="grid-container">
      <SpotCard spot={testArray}/>
    </main>
  )
}
