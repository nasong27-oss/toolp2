import { auth } from "@/lib/auth";
import ToolForm from "@/components/ToolForm";
import LoginPrompt from "@/components/LoginPrompt";

export default async function NewToolPage() {
  const session = await auth();

  if (!session?.user) {
    return <LoginPrompt message="툴을 등록하려면 Google 로그인이 필요합니다." />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">툴 등록하기</h1>
        <p className="text-gray-500 mt-1">바이코딩으로 만든 툴이나 컨텐츠를 팀원들과 공유해보세요.</p>
      </div>
      <ToolForm />
    </div>
  );
}
