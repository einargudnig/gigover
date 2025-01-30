import { Box } from '@chakra-ui/react';
import { useGetUserPrivileges } from '../../hooks/useGetUserPrivileges';

export function DisabledTask({ children }: { children: React.ReactNode }) {
	const { privileges, activeOrg } = useGetUserPrivileges();
	const disableTask = privileges.includes('VIEWER');
	return (
		<>
			{activeOrg ? (
				<>
					{disableTask ? (
						<Box
							pointerEvents="none" // Prevents any interaction
							opacity={0.5} // Makes it look disabled
							bg="gray.200" // Optional: Change background color for visual cue
						>
							{children}
						</Box>
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
