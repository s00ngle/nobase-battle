import CharacterInfo from "@/components/character/CharacterInfo";
import CharacterItem from "@/components/character/CharacterItem";
import { characterData } from "@/data/characterInfo";

const TestPage = () => {
  const data = characterData;
  return (
    <div>
      <CharacterInfo
        character={
          <CharacterItem nickname={data.name} description={data.prompt} />
        }
        data={data}
      />
    </div>
  );
};

export default TestPage;
