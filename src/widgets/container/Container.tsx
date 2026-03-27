export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-300 px-5 pt-25 pb-25 flex flex-col mx-auto">
      {children}
    </div>
  );
};