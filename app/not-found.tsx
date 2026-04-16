import { Button, Result } from "antd";
import Link from "next/link";

export default function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link
          href="/admin/schedule-view"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          <Button type="primary">Go Schedule View</Button>
        </Link>
      }
    />
  );
}
