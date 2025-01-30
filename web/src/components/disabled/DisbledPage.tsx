import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';
import { useGetUserPrivileges } from '../../hooks/useGetUserPrivileges';

export function DisabledPage({ children }: { children: React.ReactNode }) {
	const { privileges, activeOrg } = useGetUserPrivileges();

	const disablePage = privileges.includes('VIEWER');

	// First, we ned to check if there is an active organization.
	// If user is on his personal space he doesn't have an active organization, and he can view all pages.
	// If there is an active organization, we need to check if the user has the VIEWER privilege.
	// If the user has the VIEWER privilege, we need to disable the page and show an error message.

	return (
		<>
			{activeOrg ? (
				<>
					{disablePage ? (
						<>
							<Alert status="error">
								<AlertIcon />
								<AlertTitle mr={2}>Access denied!</AlertTitle>
								<AlertDescription>
									You do not have permission to view this page!
								</AlertDescription>
							</Alert>
							<Box
								pointerEvents="none" // Prevents any interaction
								opacity={0.5} // Makes it look disabled
								bg="gray.200" // Optional: Change background color for visual cue
							>
								{children}
							</Box>
						</>
					) : (
						<Box>{children}</Box>
					)}
				</>
			) : (
				<Box>{children}</Box>
			)}
		</>
	);
}
