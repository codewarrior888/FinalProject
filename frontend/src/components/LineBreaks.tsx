const LineBreaks: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    return (
      <>
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </>
    );
  };
  
export default LineBreaks;