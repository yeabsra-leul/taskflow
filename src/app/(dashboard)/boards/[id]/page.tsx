import BoardDetail from "@/components/board-detail";

const Page = async({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const {id:boardId} = await params;
  
  return <BoardDetail boardId={boardId}/>;
};

export default Page;
