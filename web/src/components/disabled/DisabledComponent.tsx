import { Box, Tooltip } from '@chakra-ui/react';
import { useGetUserPrivileges } from '../../hooks/useGetUserPrivileges';

export function DisabledComponent({ children }: { children: React.ReactNode }) {
	const { privileges, activeOrg } = useGetUserPrivileges();

	// As of know the VIEWER privilege si the only one where we drastically limit the user's access

	const isDisabled = privileges.includes('VIEWER');
	return (
		<>
			{activeOrg ? (
				<>
					{isDisabled ? (
						<Box
							pointerEvents="none" // Prevents any interaction
							opacity={0.5} // Makes it look disabled
							bg="gray.200" // Optional: Change background color for visual cue
						>
							<Tooltip label="You do not have permission!">{children}</Tooltip>
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
