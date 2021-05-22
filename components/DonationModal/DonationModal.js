import Link from "next/link";

function DonationModal() {
  return (
    <Link href="/register">
      <a className="font-medium sm:px-4 sm:py-2 sm:bg-gradient-to-r from-indigo-400 dark:from-yellow-600 to-indigo-800 dark:to-yellow-200 sm:text-white sm:dark:text-gray-900 rounded">
        Start DCA for free
      </a>
    </Link>
  );
}

export default DonationModal;
