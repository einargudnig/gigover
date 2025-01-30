import { Box } from '@chakra-ui/react';
import { useGetUserPrivileges } from '../../hooks/useGetUserPrivileges';

// there are some subMenus that should all be disabled for viewers

export function DisabledSubMenu({ children }: { children: React.ReactNode }) {
	const { privileges, activeOrg } = useGetUserPrivileges();

	const disableSubMenu = privileges.includes('VIEWER');
	return (
		<>
			{activeOrg ? (
				<>
					{disableSubMenu ? (
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
